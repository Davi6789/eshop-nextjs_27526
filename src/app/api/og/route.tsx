// src/app/api/og/route.tsx 

import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") || "E-Shop"
  const price = searchParams.get("price")
  const image = searchParams.get("image")

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "48px",
            maxWidth: "80%",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🛍️</div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {title}
          </h1>
          {price && (
            <p
              style={{
                fontSize: 32,
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              {price} €
            </p>
          )}
          <p
            style={{
              fontSize: 24,
              color: "#6b7280",
              marginTop: 20,
            }}
          >
            Entdecke jetzt bei E-Shop!
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}