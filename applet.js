const Applet = imports.ui.applet;
const Cinnamon = imports.gi.Cinnamon;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Settings = imports.ui.settings;
const Main = imports.ui.main;

class CinnamonWindowsQuickListApplet extends Applet.IconApplet {
    constructor(metadata, orientation, panel_height, instance_id) {
        super(orientation, panel_height, instance_id);

        this.set_applet_icon_symbolic_name('windows-quick-list');
        this.set_applet_tooltip(_('All windows'));
        this._menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menuManager.addMenu(this._menu);
        this.subMenuItemWrapper = new PopupMenu.PopupSubMenuMenuItem(null);
        this.subMenuItemWrapper.actor.set_style_class_name('');
        this.subMenuItemWrapper.menu.actor.set_style_class_name('');
        this.menu = this.subMenuItemWrapper.menu;
        this._menu.addMenuItem(this.subMenuItemWrapper);

        this.actor.connect('scroll-event', Lang.bind(this, this.on_applet_scrolled));

        this.settings = new Settings.AppletSettings(this, metadata.uuid, instance_id);
        this.settings.bind('scroll_direction', 'scroll_direction');
        this.settings.bind('allow_cycling', 'allow_cycling');
        this.settings.bind('middle_click_shows_desktop', 'middle_click_shows_desktop');
    }

    updateMenu() {
        this.menu.removeAll();
        let empty_menu = true;
        let tracker = Cinnamon.WindowTracker.get_default();

        for (let wks = 0; wks < global.screen.n_workspaces; ++wks) {
            // construct a list with all windows
            let workspace_name = Main.getWorkspaceName(wks);
            let metaWorkspace = global.screen.get_workspace_by_index(wks);
            let windows = metaWorkspace.list_windows();
            let sticky_windows = windows.filter(function(w) {
                return !w.is_skip_taskbar() && w.is_on_all_workspaces();
            });
            windows = windows.filter(function(w) {
                return !w.is_skip_taskbar() && !w.is_on_all_workspaces();
            });

            windows = windows.filter(Main.isInteresting);

            if (sticky_windows.length && wks == 0) {
                for (let i = 0; i < sticky_windows.length; ++i) {
                    let metaWindow = sticky_windows[i];
                    let item = new PopupMenu.PopupMenuItem(metaWindow.get_title());
                    item.label.add_style_class_name('window-sticky');
                    item.connect(
                        'activate',
                        Lang.bind(this, function() {
                            this.activateWindow(metaWorkspace, metaWindow);
                        })
                    );
                    item._window = sticky_windows[i];
                    let app = tracker.get_window_app(item._window);
                    item._icon = app.create_icon_texture_for_window(24, item._window);
                    item.addActor(item._icon, {align: St.Align.END});
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }
                this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            }

            if (windows.length) {
                if (wks > 0) {
                    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
                }
                if (global.screen.n_workspaces > 1) {
                    let item = new PopupMenu.PopupMenuItem(workspace_name);
                    item.actor.reactive = false;
                    item.actor.can_focus = false;
                    item.label.add_style_class_name('popup-subtitle-menu-item');
                    if (wks == global.screen.get_active_workspace().index()) {
                        item.setShowDot(true);
                    }
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }

                for (let i = 0; i < windows.length; ++i) {
                    let metaWindow = windows[i];
                    let item = new PopupMenu.PopupMenuItem(windows[i].get_title());
                    item.connect(
                        'activate',
                        Lang.bind(this, function() {
                            this.activateWindow(metaWorkspace, metaWindow);
                        })
                    );
                    item._window = windows[i];
                    let app = tracker.get_window_app(item._window);
                    item._icon = app.create_icon_texture_for_window(24, item._window);
                    item.addActor(item._icon, {align: St.Align.END});
                    this.menu.addMenuItem(item);
                    empty_menu = false;
                }
            }
        }
        if (empty_menu) {
            let item = new PopupMenu.PopupMenuItem(_('No open windows'));
            item.actor.reactive = false;
            item.actor.can_focus = false;
            item.label.add_style_class_name('popup-subtitle-menu-item');
            this.menu.addMenuItem(item);
        }
    }

    activateWindow(metaWorkspace, metaWindow) {
        if (this._menu.isOpen) {
            this._menu.toggle_with_options(false);
        }
        this.menu.toggle();
        if (!metaWindow.is_on_all_workspaces()) {
            metaWorkspace.activate(global.get_current_time());
        }
        metaWindow.unminimize();
        metaWindow.activate(global.get_current_time());
    }

    on_applet_clicked(event) {
        this.updateMenu();
        if (!this._menu.isOpen) {
            this._menu.toggle_with_options(false);
        }
        this.menu.toggle();
    }

    on_applet_middle_clicked(event) {
        if (this.middle_click_shows_desktop) {
            global.screen.toggle_desktop(global.get_current_time());
        }
    }

    on_applet_scrolled(target, event) {
        if (this._menu.isOpen) {
            return;
        }

        let direction = event.get_scroll_direction();

        if (direction != 0 && direction != 1) {
            return;
        }

        let n_workspaces = global.screen.n_workspaces;

        direction = direction ? -1 : +1;

        if (this.scroll_direction == "left") {
            direction = -direction;
        }

        let workspaceIndex = global.screen.get_active_workspace_index();

        if (!this.allow_cycling) {
            if (direction > 0 && workspaceIndex == 0) {
                return;
            }

            if (direction < 0 && workspaceIndex == n_workspaces - 1) {
                return;
            }
        }

        let newWorkspaceIndex = ((workspaceIndex - direction) + n_workspaces) % n_workspaces;
        let newWorkspace = global.screen.get_workspace_by_index(newWorkspaceIndex);
       
        newWorkspace.activate(global.get_current_time());
    }
}

function main(metadata, orientation, panel_height, instance_id) {
    return new CinnamonWindowsQuickListApplet(metadata, orientation, panel_height, instance_id);
}
