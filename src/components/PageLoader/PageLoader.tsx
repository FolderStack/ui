import "./loader.css";

export function PageLoader() {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                zIndex: 99999,
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <span className="css-only-loader" />
            </div>
        </div>
    );
}
