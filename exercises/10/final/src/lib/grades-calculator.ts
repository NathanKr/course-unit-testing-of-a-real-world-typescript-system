import IStudent from "../types/i-student";
import * as math from "./math";
import { dummyLogger, Logger } from "ts-log";

export default class GradesCalculator {
  constructor(private log: Logger = dummyLogger) {}

  calculateAverage(grades: number[]): number {
    const avg = math.calculateAverage(grades);

    this.log.debug(avg);

    return avg;
  }

  parseCSV(csvData: string): IStudent[] {
    const lines = csvData.split("\n");
    const students: IStudent[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        const parts = line.split(",");

        const student: IStudent = {
          name: parts[0].trim(),
          grade: parseFloat(parts[1]),
        };

        if (!isNaN(student.grade)) {
          students.push(student);
        }
      }
    }

    const grades = students.map((it) => it.grade);
    this.log.debug(grades);

    return students;
  }
}
