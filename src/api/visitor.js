import request from "./request"

export function recordVisit() {
  return request.post("/visit")
}

export function getVisitorStats() {
  return request.get("/visitor")
}
