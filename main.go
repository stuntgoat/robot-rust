// listen on a websocket for osc messages and forward the data to a socket

package main

import (
	// "io"
	"log"
	"net"
	// "fmt"
	"net/http"

	"code.google.com/p/go.net/websocket"
)

// a router for multiple outs and inputs of binary data to and from sockets


// object that sends and receives a channel of binary data
// connects to 2 sockets



// a function that accepts a


// a function that returns a chuckforwarder, it takes a websocket connection, a path, and a server port


func ChuckForwarder(ws *websocket.Conn) {
	// var msg string
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
		_, err = l.Write(buf)
	}
}

func main() {

	http.Handle("/circles", websocket.Handler(ChuckForwarder))
	http.Handle("/", http.FileServer(http.Dir("static")))
	err := http.ListenAndServe(":9000", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
