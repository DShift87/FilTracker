const FAB_SIZE = 56;
const ICON_SIZE = 24; /* same as navbar icons (Dashboard, Filament, Parts) */

export function AddFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "calc(4rem + 24px + env(safe-area-inset-bottom))",
        width: FAB_SIZE,
        height: FAB_SIZE,
        borderRadius: "50%",
        padding: 0,
        border: "none",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        backgroundColor: "#f97316",
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#ea580c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f97316";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          minWidth: ICON_SIZE,
          minHeight: ICON_SIZE,
          flexShrink: 0,
        }}
      >
        <path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" />
        <path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z" />
      </svg>
    </button>
  );
}
