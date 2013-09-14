// Copied from http://chuck.cs.princeton.edu/doc/examples/osc/r.ck

fun OscRecv MakeReceiver(int port)
{
  OscRecv recv;
  // use port 6449 (or whatever)
  port => recv.port;
  return recv;
}


// build OSC address from arguments
fun string BuildOSCAddress(string path, int floats, int ints, int strings)
{
  string OSCAddress;

  path +=> OSCAddress;
  "," +=> OSCAddress;
  for (0 => int foo; foo < floats ; foo++ ) {
    " f" +=> OSCAddress;
  }
  for (0 => int foo; foo < ints; foo++) {
    " i" +=> OSCAddress;
  }
  for (0 => int foo; foo < strings; foo++ ) {
    " s" +=> OSCAddress;
  }

  return OSCAddress;
}

// TODO: - add max, min, gain,
fun void SinOsc_listen_f_f(OscRecv receiver, string address)
{
  BuildOSCAddress(address, 2, 0, 0) => string OSCAddress;
  <<<"oscaddress", OSCAddress>>>;
  receiver.event(OSCAddress) @=> OscEvent @ oe;

  SinOsc ugenX => dac;
  .2 => ugenX.gain;

  SinOsc ugenY => dac;
  .2 => ugenY.gain;


  // infinite event loop
  while (true) {
    // wait for event to arrive
    oe => now;

    // grab the next message from the queue.
    while (oe.nextMsg()) {
      float x;
      float y;
      oe.getFloat() => x;
      oe.getFloat() => y;
      <<<"x", x>>>;
      <<<"y", y>>>;
      // gets the data in the order specified by the receive event
      x => ugenX.freq;
      y => ugenY.freq;
      <<<"sent to oscaddress", OSCAddress>>>;
    }
  }
}


// listen for messages and create instruments
// accepts a string address and a port to listen for control messages
fun void CreateInstrumentListener(string createInstrumentAddress, int port)
{
  // listen for commands to create instruments
  MakeReceiver(port) @=> OscRecv @ receiver;
  receiver.listen();

  BuildOSCAddress(createInstrumentAddress, 0, 3, 2) => string OSCAddress;
  receiver.event(OSCAddress) @=> OscEvent @ osce;


  while (true) {
    osce => now;

    while (osce.nextMsg()) {
      int floats; // number of float args
      int ints; // number of integer args
      int strings; // number of strings
      string instrumentName;
      string sendAddress;

      osce.getInt() => floats;
      osce.getInt() => ints;
      osce.getInt() => strings;
      osce.getString() => instrumentName;
      osce.getString() => sendAddress;
      <<<"instrument name:", instrumentName>>>;
      <<<"sendAddress", sendAddress>>>;
      // TODO: abstract creation of instruments
      if (instrumentName == "SinOsc") {
        if ((floats == 2) && (ints == 0) && (strings == 0)) {
          <<<"Sporking shred",  sendAddress, receiver>>>;
          spork ~ SinOsc_listen_f_f(receiver, sendAddress);
        }
      }
    }
  }
}

// listen to create new instruments
// MakeReceiver(6449) @=> OscRecv @ r;
// r.listen();
CreateInstrumentListener("/control", 6449);

while (true) {1::second => now;}
