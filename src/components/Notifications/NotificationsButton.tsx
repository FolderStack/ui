import Link from "next/link";
import { BsBellFill } from "react-icons/bs";

export function NotificationsButton() {
    return (
        <Link
            href="/notifications"
            className="rounded-sm bg-gray-200 text-black p-2 hover:bg-gray-300"
            aria-label="Navigate to notifications page"
        >
            <BsBellFill size={14} />
        </Link>
    );
}
