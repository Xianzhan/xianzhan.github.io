# axum

- [axum - Ergonomic and modular web framework built with Tokio, Tower, and Hyper](https://github.com/tokio-rs/axum)

## Hello axum

Cargo.toml
```toml
[package]
name = "axum-test"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8.4"
tokio = { version = "1.0", features = ["full"] }
```

main.rs
```rs
use axum::{Router, routing::get};

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```