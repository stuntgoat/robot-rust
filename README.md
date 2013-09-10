`robot-rust`
==========

This is a collection of scripts that is used for creating arbitrary user interfaces for sending OSC data. Currently we can overlap shapes to send data for each shape when the mouse is over 2 or more shapes at the same time.

This project is using code from the following projects:<br>
[http://raphaeljs.com/](http://raphaeljs.com/)<br>
[https://github.com/aturley/jsox](https://github.com/aturley/jsox)<br>
[http://chuck.cs.princeton.edu/doc/examples/osc/r.ck](http://chuck.cs.princeton.edu/doc/examples/osc/r.ck)<br><br>

Here's a demo video wherein we send some OSC messages to an example Chuck script that has a reverb filter and an oscillator that are listening for OSC messages to change their settings: [https://www.dropbox.com/s/h7a4sskjd7zojx8/circles_demo.mov](https://www.dropbox.com/s/h7a4sskjd7zojx8/circles_demo.mov)


Here's a demo video wherein there are a pair of independent oscillators per circle instrument:
[https://www.dropbox.com/s/ftf6k8dcz767uwx/circles_demo_independent_pairs.mov](https://www.dropbox.com/s/ftf6k8dcz767uwx/circles_demo_independent_pairs.mov)

`Demo` (requires Mac OS)
========================

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

4) Navigate to [http://localhost:9000](http://localhost:9000). When you mouse over the shapes, you should hear the tone and the reverb change

----------------------

`todo:`
====

    - make squares
    - resize elements by dragging
    - rotate shapes and send the relative coordinates
