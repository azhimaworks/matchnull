export class Logger {
  private errors: string[] = [];
  private warnings: string[] = [];

  warn(message: string): void {
    this.warnings.push(message);
    if (typeof $ !== "undefined" && $.writeln) {
      $.writeln(`[WARN] ${message}`);
    }
  }

  error(message: string): void {
    this.errors.push(message);
    if (typeof $ !== "undefined" && $.writeln) {
      $.writeln(`[ERROR] ${message}`);
    }
  }

  flush(): void {
    const errorCount = this.errors.length;
    const warningCount = this.warnings.length;

    if (errorCount === 0 && warningCount === 0) return;

    let report = `Theres ${errorCount} error${errorCount > 1 ? "s" : ""} and ${warningCount} warning${warningCount > 1 ? "s" : " "}:\n\n`;

    if (errorCount > 0) {
      report += `Error:\n${this.errors.map((msg) => `- ${msg}`).join("\n")}\n\n`;
    }

    if (warningCount > 0) {
      report += `Warning:\n${this.warnings.map((msg) => `- ${msg}`).join("\n")}\n`;
    }

    alert(report.trim());

    this.clear();
  }

  clear(): void {
    this.errors = [];
    this.warnings = [];
  }
}

export const logger = new Logger();
