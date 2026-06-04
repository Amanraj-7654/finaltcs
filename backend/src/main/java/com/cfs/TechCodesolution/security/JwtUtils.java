package com.cfs.TechCodesolution.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import org.slf4j.LoggerFactory;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes); // ✅ auto-picks correct algorithm
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // ✅ use Key object
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey()) // ✅ use Key object
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}

// @Component
// public class JwtUtils {
// private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
//
// @Value("${techcodesolution.app.jwtSecret:techcodesolutionSecretKey}")
// private String jwtSecret;
//
// @Value("${techcodesolution.app.jwtExpirationMs:86400000}")
// private int jwtExpirationMs;
//
// public String generateJwtToken(Authentication authentication) {
// UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
//
// return Jwts.builder()
// .setSubject((userPrincipal.getUsername()))
// .setIssuedAt(new Date())
// .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
// .signWith(SignatureAlgorithm.HS512, jwtSecret)
// .compact();
// }
//
// public String getUserNameFromJwtToken(String token) {
// return
// Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
// }
//
// public boolean validateJwtToken(String authToken) {
// try {
// Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
// return true;
// } catch (SignatureException e) {
// logger.error("Invalid JWT signature: {}", e.getMessage());
// } catch (MalformedJwtException e) {
// logger.error("Invalid JWT token: {}", e.getMessage());
// } catch (ExpiredJwtException e) {
// logger.error("JWT token is expired: {}", e.getMessage());
// } catch (UnsupportedJwtException e) {
// logger.error("JWT token is unsupported: {}", e.getMessage());
// } catch (IllegalArgumentException e) {
// logger.error("JWT claims string is empty: {}", e.getMessage());
// }
//
// return false;
// }
// }
