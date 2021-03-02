package main

import (
    "encoding/json"
    "fmt"
    "log"
    "math/rand"
    "net/http"
    "time"
)

var seed = rand.NewSource(time.Now().UnixNano())
var random_generator = rand.New(seed)

func homePage(w http.ResponseWriter, r *http.Request){
    rolls := []int{}
    for i := 0; i < 3; i++ {
        rolls = append(rolls, random_generator.Intn(6))
    }
    // Top level object should be a dict with a "data" field
    ret := map[string][]int{
        "data": rolls,
    }
    dump, _ := json.Marshal(ret)
    fmt.Fprintf(w, string(dump))
    fmt.Println("Endpoint Hit: homePage")
}

func handleRequests() {
    http.HandleFunc("/", homePage)
    log.Fatal(http.ListenAndServe(":5001", nil))
}

func main() {
    fmt.Println("starting up...")
    handleRequests()
}
