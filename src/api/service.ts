import { AxiosResponse} from "axios"
import $api from "./apiInstance"
import { Course } from "../state/features/coursesSlice"

export default class AppService {
  static async getCourses(lang: "rus" | "eng"): Promise<AxiosResponse<Course[]>> {
    return $api.get<Course[]>("/courses")
  }

  static async getShortCourses(lang: "rus" | "eng"): Promise<AxiosResponse<Course[]>> {
    return $api.get<Course[]>("/courses/short")
  }
}