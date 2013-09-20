`robot-rust`
==========

This is a collection of scripts that is used for creating arbitrary user interfaces for sending OSC data via the browser. Currently we can overlap shapes to send data for each shape when the mouse is over 2 or more shapes at the same time, where 'shapes' are either a square or a circle. 

This project is using code from the following projects:<br>
[http://raphaeljs.com/](http://raphaeljs.com/)<br>
[https://github.com/ElbertF/Raphael.FreeTransform](https://github.com/ElbertF/Raphael.FreeTransform)<br>
[https://github.com/aturley/jsox](https://github.com/aturley/jsox)<br>

Here's a demo video wherein there are a pair of independent oscillators per circle and square instruments:
[https://www.dropbox.com/s/shdd0vplijgp4v1/rotating_circles_squares.mov](https://www.dropbox.com/s/shdd0vplijgp4v1/rotating_circles_squares.mov)

`Demo`
======

This demo requires Mac OS, unless you want to build the Go demo_server from source on another platform. 

To play with the demo you will have to do several steps after cloning this repo.

1) Install Chuck and put it on your `$PATH`<br>
2) Cd to the repo directory and run the chuck script.

	# NOTES:
	# 1) This opens a UDP port on 6449 to listen for OSC messages
	# 2) This command will play a sound if everything is working correctly.

    $ chuck chucks/circles.ck

3) Start the websocket server, which will start listening on port 9000

	# NOTES:
	# 1) This opens a TCP port on 9000 for listening for http and websocket requests

	$ ./bin/demo_server

4) Navigate to [http://localhost:9000](http://localhost:9000).

When you mouse over the shapes, you should hear the pitch corresponding to the relative distance of the mouse from the x and y coordinates of the initial top left position of each shape. You should be able to move and rotate each shape.

----------------------

`todo:`
====

	- Go websocket server should destroy all Chuck instruments on socket close
	- implement Path.js @ https://github.com/lemonzi/path.js for sequencing movement
	- more instruments and effects
	- use control messages to the Go server to establish new OSC connections.
