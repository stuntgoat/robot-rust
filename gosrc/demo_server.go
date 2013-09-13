// - listen on a websocket for osc messages and forward the data to a UDP socket
// - host static files via HTTP

package main

import (
	// "fmt"
	"io"
	"log"
	"net"
	"net/http"

	"code.google.com/p/go.net/websocket"
)

func ChuckForwarder(ws *websocket.Conn) {
	defer func() {
        if r := recover(); r != nil {
            log.Println(r)
        }
    }()

	var buf []byte
	serverAddr, err := net.ResolveUDPAddr("udp", ":6449")

	chuck, err := net.DialUDP("udp", nil, serverAddr)

	if err != nil {
		log.Fatal(err)
	}
	defer chuck.Close()

	for {
		err := websocket.Message.Receive(ws, &buf)
		if err != nil {
			if err == io.EOF {
				panic("websocket connection closed")
			} else {
				panic("websocket.Message.Receive: " + err.Error())
			}
		}

		// forward data to OSC socket
		_, err = chuck.Write(buf)
	}
}


func main() {
	http.Handle("/ws", websocket.Handler(ChuckForwarder))
	http.Handle("/", http.FileServer(http.Dir("static")))
	err := http.ListenAndServe(":9000", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
