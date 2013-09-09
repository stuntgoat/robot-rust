


// the patch
SinOsc s => JCRev r => dac;
.5 => s.gain;
.1 => r.mix;

// create our OSC receiver
OscRecv recv;
// use port 6449 (or whatever)
6449 => recv.port;
// start listening (launch thread)
recv.listen();

// create an address in the receiver, store in new variable
recv.event( "/biggie, i f" ) @=> OscEvent @ oe;

// infinite event loop
while( true )
{
    // wait for event to arrive
    oe => now;

    // grab the next message from the queue.
    while( oe.nextMsg() )
    {
      int i;
      float f;

        // getFloat fetches the expected float (as indicated by "i f")
        oe.getInt() => i => Std.mtof => s.freq;
        oe.getFloat() => f => s.gain;
        //        <<< "got (via OSC):", i, f >>>;
    }
}


/* // the patch */
/* SndBuf buf => dac; */
/* // load the file */
/* me.sourceDir() + "/../data/snare.wav" => buf.read; */
/* // don't play yet */
/* 0 => buf.play;  */

/* // create our OSC receiver */
/* OscRecv recv; */
/* // use port 6449 */
/* 6449 => recv.port; */
/* // start listening (launch thread) */
/* recv.listen(); */

/* // create an address in the receiver, store in new variable */
/* recv.event( "/sndbuf/buf/rate, f" ) @=> OscEvent oe; */

/* // infinite event loop */
/* while ( true ) */
/* { */
/*     // wait for event to arrive */
/*     oe => now; */

/*     // grab the next message from the queue.  */
/*     while ( oe.nextMsg() != 0 ) */
/*     {  */
/*         // getFloat fetches the expected float (as indicated by "f") */
/*         oe.getFloat() => buf.play; */
/*         // print */
/*         <<< "got (via OSC):", buf.play() >>>; */
/*         // set play pointer to beginning */
/*         0 => buf.pos; */
/*     } */
/* } */
