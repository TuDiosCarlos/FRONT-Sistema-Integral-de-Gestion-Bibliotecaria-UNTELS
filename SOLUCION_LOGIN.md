# 🔐 SOLUCIÓN - Login Frontend/Backend

## 📋 Análisis del Problema

Basado en la revisión del código frontend y la configuración del backend, el problema está en la **desincronización entre lo que el frontend envía y lo que el backend espera**.

### Frontend - Lo que ESTÁ HACIENDO:
**Ubicación:** `src/app/services/authservice.ts` (líneas 23-27)

```typescript
login(username: string, password: string): Observable<JwtResponse> {
  const body: LoginRequest = { username, password };
  return this.http.post<JwtResponse>(`${this.url}/login`, body).pipe(
    tap((resp) => this.guardarSesion(resp))
  );
}
```

✅ **Correcto:** Envía POST a `http://localhost:8080/login` con:
```json
{
  "username": "admin1",
  "password": "admin1"
}
```

✅ **Espera respuesta:**
```json
{
  "token": "string",
  "idUsuario": 1,
  "username": "admin1",
  "nombre": "Admin Usuario",
  "rol": "ADMIN"
}
```

---

## 🔍 PROBLEMAS IDENTIFICADOS

### ⚠️ PROBLEMA 1: Endpoint `/login` NO existe o está mal configurado en Backend

El backend necesita un controlador JwtAuthenticationController con el endpoint `/login` que:
1. Acepte `POST /login`
2. Reciba `{ username, password }`
3. Retorne `{ token, idUsuario, username, nombre, rol }`

### ⚠️ PROBLEMA 2: CORS no configurado correctamente

El frontend está en Angular (probablemente `http://localhost:4200`) y hace requests al backend (`http://localhost:8080`). **CORS debe estar habilitado.**

### ⚠️ PROBLEMA 3: Implementación incompleta del JWT

---

## ✅ SOLUCIÓN - Código necesario en el Backend

### 1. DTO para el Login Request
**Archivo:** `src/main/java/pe/edu/untels/dtos/LoginRequest.java`

```java
package pe.edu.untels.dtos;

public class LoginRequest {
    private String username;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

### 2. DTO para la respuesta JWT
**Archivo:** `src/main/java/pe/edu/untels/dtos/JwtResponse.java`

```java
package pe.edu.untels.dtos;

public class JwtResponse {
    private String token;
    private Long idUsuario;
    private String username;
    private String nombre;
    private String rol;

    public JwtResponse() {}

    public JwtResponse(String token, Long idUsuario, String username, String nombre, String rol) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.username = username;
        this.nombre = nombre;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
```

### 3. Controlador de Autenticación
**Archivo:** `src/main/java/pe/edu/untels/controllers/JwtAuthenticationController.java`

```java
package pe.edu.untels.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import pe.edu.untels.dtos.LoginRequest;
import pe.edu.untels.dtos.JwtResponse;
import pe.edu.untels.entities.Usuario;
import pe.edu.untels.securities.JwtTokenUtil;
import pe.edu.untels.services.UsuarioService;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class JwtAuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar usuario
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // Obtener usuario de BD
            Usuario usuario = usuarioService.obtenerPorUsername(loginRequest.getUsername());
            
            if (usuario == null) {
                return ResponseEntity.status(401).body("Usuario no encontrado");
            }

            // Generar JWT
            String token = jwtTokenUtil.generateToken(usuario.getUsername());

            // Retornar respuesta con todos los datos
            JwtResponse response = new JwtResponse(
                token,
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getRol()
            );

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }
    }
}
```

### 4. Servicio de Usuario - Método necesario
**En:** `src/main/java/pe/edu/untels/services/UsuarioService.java` o `UsuarioServiceImplement.java`

Asegúrate que tenga este método:

```java
public Usuario obtenerPorUsername(String username) {
    return usuarioRepository.findByUsername(username)
        .orElse(null);
}
```

### 5. Repositorio de Usuario
**En:** `src/main/java/pe/edu/untels/repositories/IUsuarioRepository.java`

Asegúrate que tenga:

```java
import java.util.Optional;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}
```

### 6. Configuración de Seguridad (CORS)
**Archivo:** `src/main/java/pe/edu/untels/securities/WebSecurityConfig.java`

```java
package pe.edu.untels.securities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);
        
        authenticationManagerBuilder
            .userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
        
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers("/login").permitAll()
            .antMatchers("/swagger-ui.html").permitAll()
            .antMatchers("/v3/api-docs/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(java.util.Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 7. Entidad Usuario - Atributos necesarios
**En:** `src/main/java/pe/edu/untels/entities/Usuario.java`

Asegúrate que tenga estos campos:

```java
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String nombre;
    private String rol;
    
    // ... resto de campos y getters/setters
    
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getNombre() { return nombre; }
    public String getRol() { return rol; }
}
```

---

## 🔧 CHECKLIST DE VERIFICACIÓN

- [ ] **Existe el endpoint POST `/login`** en JwtAuthenticationController
- [ ] **El método `obtenerPorUsername()` existe** en UsuarioService
- [ ] **La consulta SQL busca por `username`** (no por email u otro campo)
- [ ] **CORS está habilitado** para `http://localhost:4200`
- [ ] **El campo `username` existe** en la tabla `usuario` de BD
- [ ] **Las contraseñas en BD están hasheadas con BCrypt** (como indicas que están)
- [ ] **El AuthenticationManager usa BCryptPasswordEncoder**
- [ ] **El endpoint /login NO requiere autenticación** (permitAll)
- [ ] **La respuesta incluye:** `token`, `idUsuario`, `username`, `nombre`, `rol`

---

## 🧪 PRUEBA RÁPIDA CON CURL

Desde terminal, prueba directamente:

```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"admin1"}'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "idUsuario": 1,
  "username": "admin1",
  "nombre": "Administrador 1",
  "rol": "ADMIN"
}
```

**Si ves error 401:** El backend no está autenticando correctamente
**Si ves error 404:** El endpoint `/login` no existe
**Si ves CORS error:** CORS no está configurado

---

## 🚀 INFORMACIÓN DE USUARIOS EN BD

```
Usuario: admin1 | Contraseña: admin1
Hash: $2a$12$7/8spXDjcdh3xUJxlxZSGuJoa/Zge2lKKuTr7vwWLfYmjfir0lpkq

Usuario: admin2 | Contraseña: admin2
Hash: $2a$12$N5TS/vYxKvAo2Lptwsqr7uZ7Yh7MSaTUmcMlC/PgE0p6nU0FiYHIK

Usuario: biblio1 | Contraseña: biblio1
Hash: $2a$12$/eOx79LC6F./Aje8cMhvheQ8vJjMW0zzKHgC.SImqa4zxh1j4KFya
```

### SQL de inserción verificación:
```sql
SELECT id, username, nombre, rol FROM usuario 
WHERE username IN ('admin1', 'admin2', 'biblio1');
```

---

## 📝 NOTAS IMPORTANTES

1. **Frontend espera exactamente estos campos en respuesta:**
   - `token` (string)
   - `idUsuario` (number)
   - `username` (string)
   - `nombre` (string)
   - `rol` (string)

2. **Si algún campo falta o tiene diferente tipo**, el frontend los guardará como `null` o `undefined`

3. **El JWT debe ser un token válido con expiración** (configurado en `application.properties`)

4. **Los datos se guardan en localStorage:**
   - `token` → localStorage['token']
   - `rol` → localStorage['rol']
   - `nombre` → localStorage['nombre']
   - `username` → localStorage['username']
   - `idUsuario` → localStorage['idUsuario']

5. **Otros endpoints usan el token** via `Authorization: Bearer <token>` header

---

## ❌ ERRORES COMUNES

| Síntoma | Causa | Solución |
|---------|-------|----------|
| "Usuario o contraseña incorrectos" | Contraseña no se valida | Verificar BCryptPasswordEncoder |
| CORS error en console | CORS no configurado | Agregar configuración CORS |
| Endpoint no encontrado (404) | `/login` no existe | Crear controlador |
| Null en localStorage | Response sin campos requeridos | Retornar todos los 5 campos |
| Token inválido después | JWT_SECRET no coincide | Verificar `jwt.secret` |

---

## 📞 PRÓXIMOS PASOS

1. **Verifica que existan todos los archivos mencionados** en tu backend
2. **Copia el código de cada sección** donde sea necesario
3. **Ejecuta el prueba con CURL** para verificar el endpoint
4. **Si funciona CURL pero no Angular**, es un problema de CORS
5. **Si no funciona CURL**, es un problema del backend

---

**Última actualización:** 2026-07-05
**Estado:** Análisis completo del problema + Solución code-ready
