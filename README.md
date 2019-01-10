# Windows Quick List 2
The default [`windows-quick-list`](https://github.com/linuxmint/Cinnamon/tree/master/files/usr/share/cinnamon/applets/windows-quick-list%40cinnamon.org) in Linux Mint's Cinnamon desktop environment felt like it was lacking a certain something. I decided to remedy this by adding some functionality I'd been missing.

Now, scrolling while the cursor is over the applet causes the workspace to switch. Middle clicking will toggle the desktop. To me, this feels much better.

## Settings

The applet is pretty configurable. You can control:

* The direction of workspace switching when you scroll
* Whether workspaces cycle (i.e. if you switch left when you're on the first workspace, do you switch to the last workspace?)
* Whether middle clicking shows the desktop or not

By default scrolling down switches right, workspaces cycle, and middle clicking will show the desktop.


## Installation

I might at some point look into adding this to Cinnamon spices. For now though:
1. Download the latest release from the releases tab. You want the first `.zip` archive, NOT one of the source code archives. 
2. Then, extract the `.zip` into `~/.local/share/cinnamon/applets/`; you should end up with being able to find `manifest.json` at `~/.local/share/cinnamon/applets/windows-quick-list-2@davidhickey/manifest.json`.
3. Then go to the Applets program in your Cinnamon settings and add Windows Quick List 2 to your panel, wherever you like. That's it! You're done.


## Image Gallery

#### Settings Menu

![Settings menu](https://raw.githubusercontent.com/David-Hickey/windows-quick-list-2/master/images/settings.png)
