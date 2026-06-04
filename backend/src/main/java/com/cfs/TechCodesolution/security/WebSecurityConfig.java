package com.cfs.TechCodesolution.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    // ─── Beans ───────────────────────────────────────────────────────────────

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

//    public void setUserDetailsServiceImpl(UserDetailsServiceImpl userDetailsService){
//        this.userDetailsService=userDetailsService;
//    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // ─── Security Filter Chain ────────────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS — must come before csrf disable
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF (stateless JWT app doesn't need it)
                .csrf(csrf -> csrf.disable())

                // 3. Return 401 for unauthenticated requests instead of redirect
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(unauthorizedHandler))

                // 4. Stateless session — no HttpSession created
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 5. Route-level authorization
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/promote/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/api/roadmaps/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contests/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/questions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/count").permitAll()
                        .requestMatchers("/api/submissions/run").permitAll()

                        // WebSocket handshake + SockJS fallback endpoints
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/ws-info/**").permitAll()

                        // All other requests need a valid JWT
                        .anyRequest().authenticated()
                );

        // 6. Register our custom auth provider
        http.authenticationProvider(authenticationProvider());

        // 7. JWT filter runs before Spring's username/password filter
        http.addFilterBefore(
                authenticationJwtTokenFilter(),
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    // ─── CORS Configuration ───────────────────────────────────────────────────

    @org.springframework.beans.factory.annotation.Value("${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174,http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Support comma separated origins from env variable
        config.setAllowedOrigins(java.util.Arrays.asList(allowedOrigins.split(",")));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Allow all headers (Authorization, Content-Type, etc.)
        config.setAllowedHeaders(List.of("*"));

        // Required when frontend sends cookies / Authorization header
        config.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
