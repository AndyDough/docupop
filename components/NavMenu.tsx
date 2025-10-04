import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function NavMenu() {
	function handleLogout() {
		// TODO: Implement actual logout logic (e.g., signOut from next-auth)
		console.log("Logout clicked");
	}

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<Button variant="outline" onClick={handleLogout}>
						Logout
					</Button>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
