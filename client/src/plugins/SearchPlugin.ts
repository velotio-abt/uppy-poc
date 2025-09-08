// FileSearchPlugin.ts
import { UIPlugin, type Uppy, type UppyFile } from "@uppy/core";
import { h } from "preact";

// eslint-disable-next-line
interface FileSearchPluginOptions {}

export default class FileSearchPlugin extends UIPlugin<FileSearchPluginOptions> {
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(uppy: Uppy, opts: FileSearchPluginOptions = {}) {
    super(uppy, opts);
    this.id = "FileSearchPlugin";
    this.type = "ui";

    this.handleInput = this.handleInput.bind(this);
    this.updateDashboardItemsVisibility =
      this.updateDashboardItemsVisibility.bind(this);
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.toLowerCase();

    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

    this.debounceTimeout = setTimeout(() => {
      this.uppy.getFiles().forEach((file: UppyFile) => {
        const matches = file.name.toLowerCase().includes(query);
        this.uppy.setFileMeta(file.id, {
          hiddenInDashboard: !matches,
        });
      });

      this.updateDashboardItemsVisibility();
    }, 200);
  }

  private updateDashboardItemsVisibility(): void {
    requestAnimationFrame(() => {
      const items = document.querySelectorAll<HTMLElement>(
        ".uppy-DashboardItem"
      );

      items.forEach((item) => {
        const fileId = item.getAttribute("data-uppy-file-id");
        if (!fileId) return;

        const file = this.uppy.getFile(fileId);
        const shouldHide = file?.meta?.hiddenInDashboard;

        item.style.display = shouldHide ? "none" : "";
      });
    });
  }

  render() {
    return h("div", { style: { padding: "8px 0" } }, [
      h("input", {
        type: "text",
        className: "test-input-123",
        placeholder: "🔍 Search files...",
        onInput: this.handleInput,
        style: {
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        },
      }),
    ]);
  }

  install(): void {
    // this.uppy.addTarget(this);
    this.uppy.on("file-added", this.updateDashboardItemsVisibility);
    this.uppy.on("file-removed", this.updateDashboardItemsVisibility);
  }

  uninstall(): void {
    // this.uppy.removeTarget(this);
    this.uppy.off("file-added", this.updateDashboardItemsVisibility);
    this.uppy.off("file-removed", this.updateDashboardItemsVisibility);
  }
}
