export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public createdAt: Date;

  constructor(message: string, level: LogSeverityLevel) {
    this.level = level;
    this.message = message;
    this.createdAt = new Date();
  }

  /**
   * Creates a LogEntity instance from a JSON string representation.
   *
   * @param json - The JSON string containing the log data with message, level, and createdAt properties
   * @returns A new LogEntity instance with the data from the JSON string
   *
   * @example
   * ```typescript
   * const jsonString = '{"message":"Test log","level":"high","createdAt":"2023-01-01T00:00:00.000Z"}';
   * const logEntity = LogEntity.fromJson(jsonString);
   * ```
   */
  static fromJson(json: string): LogEntity {
    const { message, level, createdAt } = JSON.parse(json);
    const log = new LogEntity(message, level);
    log.createdAt = new Date(createdAt);
    return log;
  }
}
