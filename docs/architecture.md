# System Architecture

## Component Diagram

```mermaid
graph TD
    Client[Client] -->|HTTP Requests| API[Express API]
    
    subgraph Backend
        API --> Auth[Authentication Service]
        API --> Game[Game Session Service]
        API --> LB[Leaderboard Service]
        
        Auth -->|Read/Write| UserStore[(User Store)]
        Game -->|Read/Write| GameStore[(Game Sessions)]
        Game -->|Read/Write| ResultStore[(Game Results)]
        LB -->|Read| ResultStore
        LB -->|Read| UserStore
    end
    
    subgraph "Authentication Flow"
        Login["/auth/login"] -->|Issues| JWT[JWT Token]
        JWT -->|Used for| Auth[Authentication]
    end
    
    subgraph "Game Flow"
        Start["/games/:userId/start"] -->|Creates| Session[Game Session]
        Session -->|Stores| StartTime[Start Time]
        Stop["/games/:userId/stop"] -->|Calculates| Deviation[Time Deviation]
        Deviation -->|Updates| Leaderboard[Leaderboard]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant Auth as Authentication Service
    participant Game as Game Session Service
    participant LB as Leaderboard Service
    participant DB as In-Memory Store
    
    Client->>Auth: Register/Login
    Auth->>DB: Store user data
    Auth->>Client: Return JWT token
    
    Client->>Game: Start game timer
    Game->>DB: Store session with start time
    Game->>Client: Return session token
    
    Note over Client: Wait ~10 seconds
    
    Client->>Game: Stop game timer
    Game->>DB: Calculate deviation & update results
    Game->>Client: Return score & deviation
    
    Client->>LB: Get leaderboard
    LB->>DB: Retrieve & sort user results
    LB->>Client: Return top 10 players
```

## Deployment Architecture

For a production environment, the following architecture would be recommended:

```mermaid
graph TD
    Client[Client] -->|HTTPS| LB[Load Balancer]
    LB -->|HTTP| API1[API Instance 1]
    LB -->|HTTP| API2[API Instance 2]
    LB -->|HTTP| API3[API Instance 3]
    
    API1 --> Redis[(Redis Cache)]
    API2 --> Redis
    API3 --> Redis
    
    API1 --> DB[(PostgreSQL)]
    API2 --> DB
    API3 --> DB
    
    subgraph "Monitoring & Logging"
        API1 --> Metrics[Prometheus]
        API2 --> Metrics
        API3 --> Metrics
        Metrics --> Dashboard[Grafana Dashboard]
    end
```

## Scalability Considerations

1. **Stateless API Design**
   - Each API instance can handle requests independently
   - Session state stored in Redis for fast access

2. **Database Scaling**
   - Read replicas for leaderboard queries
   - Connection pooling for efficient resource usage

3. **Caching Strategy**
   - Leaderboard results cached with time-based invalidation
   - User authentication status cached to reduce database load

4. **Load Balancing**
   - Round-robin distribution for even load
   - Health checks to route away from unhealthy instances
