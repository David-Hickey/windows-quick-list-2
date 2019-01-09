# Windows Quick List 2
The default `windows-quick-list` in Linux Mint's Cinnamon desktop environment felt like it was lacking a certain something. I decided to remedy this by adding some functionality I'd been missing.

Now, scrolling while the cursor is over the applet causes the workspace to switch. Middle clicking will toggle the desktop. To me, this feels much better.

### Settings

The applet is pretty configurable. You can control:

* The direction of workspace switching when you scroll
* Whether workspaces cycle (i.e. if you switch left when you're on the first workspace, do you switch to the last workspace?)
* Whether middle clicking shows the desktop or not

By default scrolling down switches right, workspaces cycle, and middle clicking will show the desktop.


### Installation

I might at some point look into adding this to Cinnamon spices. For now though, just drop `files/windows-quick-list-2@davidhickey` from this repository in your `~/.local/share/cinnamon/applets/`. If this folder doesn't exist on your computer, just create it yourself.
