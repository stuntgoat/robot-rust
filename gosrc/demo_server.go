// listen on a websocket for osc messages and forward the data to a UDP socket

package main

import (
	// "fmt"
	"log"
	"net"
	"net/http"

	"code.google.com/p/go.net/websocket"
)

func ChuckForwarder(ws *websocket.Conn) {
	var buf []byte
	serverAddr, err := net.ResolveUDPAddr("udp", ":6449")

	l, err := net.DialUDP("udp", nil, serverAddr)

	if err != nil {
		log.Fatal(err)
	}
	defer l.Close()

	for {
		err := websocket.Message.Receive(ws, &buf)
		if err != nil {
			panic("Message.Receive: " + err.Error())
		}

		// forward data to OSC socket
		// fmt.Println("string(buf)", string(buf))
		_, err = l.Write(buf)
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
