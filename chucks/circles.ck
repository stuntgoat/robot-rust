// Copied from http://chuck.cs.princeton.edu/doc/examples/osc/r.ck
float DEFAULT_GAIN_ON;

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

fun float Freq_From_Float_min_max(float value, int min, int max)
{
  // max - min = range

  // return (range * value) + min
}

// TODO: - add max, min, gain,
fun void SinOsc_listen_f_f(OscRecv receiver, string address, int min, int max)
{
  // build address that accepts 3 floats(freq1, freq2, gain)
  BuildOSCAddress(address, 3, 0, 0) => string OSCAddress;
  <<<"oscaddress", OSCAddress>>>;
  receiver.event(OSCAddress) @=> OscEvent @ oe;

  SinOsc ugenX => dac;
  .2 => ugenX.gain;

  SinOsc ugenY => dac;
  .2 => ugenY.gain;

  float gain;
  // infinite event loop
  while (true) {
    // wait for event to arrive
    oe => now;

    // grab the next message from the queue.
    while (oe.nextMsg()) {
      float x;
      float y;
      float newGain;
      oe.getFloat() => x;
      oe.getFloat() => y;
      oe.getFloat() => newGain;
      <<<"x", x>>>;
      <<<"y", y>>>;
      // gets the data in the order specified by the receive event

      x => ugenX.freq;
      y => ugenY.freq;
      if (newGain != gain) {
        <<<"setting gain:", newGain>>>;
        gain => ugenX.gain;
        gain => ugenY.gain;
      }

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
        if ((floats == 2) && (ints == 2) && (strings == 0)) {
          <<<"Sporking shred",  sendAddress, receiver>>>;
          spork ~ SinOsc_listen_f_f(receiver, sendAddress, min, max);
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
