// Copied from http://chuck.cs.princeton.edu/doc/examples/osc/r.ck

fun OscRecv circleReceiver(int port)
{
  OscRecv recv;
  // use port 6449 (or whatever)
  port => recv.port;
  return recv;
}


fun void SinOsc_listen_i_i(OscRecv receiver, string address)
{
  // start listening (launch thread)
  receiver.listen();
  receiver.event(<<< address >>>) @=> OscEvent @ oe;
  SinOsc ugenX => dac;
  .2 => ugenX.gain;

  SinOsc ugenY => dac;
  .2 => ugenY.gain;

  // infinite event loop
  while (true)
    {
      // wait for event to arrive
      oe => now;

      // grab the next message from the queue.
      while (oe.nextMsg())
        {
          int x;
          int y;
          // gets the data in the order specified by the receive event
          oe.getInt() => x => Std.mtof => ugenX.freq;
          oe.getInt() => y => Std.mtof => ugenY.freq;
        }
    }
}


circleReceiver(6449) @=> OscRecv r;

spork ~ SinOsc_listen_i_i(r, "/biggie, i i");
spork ~ SinOsc_listen_i_i(r, "/beyonce, i i");
spork ~ SinOsc_listen_i_i(r, "/smalls, i i");

while (true) {1::second => now;}
