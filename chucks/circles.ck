1 @=> int LOGGING;
.2  @=> float DEFAULT_GAIN_ON;

// Slowly turn the gain down to avoid clicking sounds on the dac
fun void TurnItDown(UGen ug)
{
  float current;
  ug.gain() => current;

  if (current == 0) {
    return;
  } else if (current < 0) {
    0 => ug.gain;
    return;
  }

  while (current > 0) {
    .001 -=> current;
    current => ug.gain;
    1::samp => now;
  }
}


// Slowly turn the gain up to avoid clicking sounds on the dac
fun void TurnItUp(UGen ug, float level)
{
  ug.gain() @=> float current;
  while (current < level) {
    .001 +=> current;
    current => ug.gain;
    1::samp => now;
  }
}


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

fun void SinOsc_listen(OscRecv receiver, string address, float min, float max)
{
  // build address that accepts 3 floats(freq1, freq2, gain)
  BuildOSCAddress(address, 3, 0, 1) => string OSCAddress;
  <<<"oscaddress", OSCAddress>>>;

  receiver.event(OSCAddress) @=> OscEvent @ oe;

  DEFAULT_GAIN_ON => float gain;

  SinOsc ugenX => dac;
  gain => ugenX.gain;

  SinOsc ugenY => dac;
  gain => ugenY.gain;

  max - min @=> float range;

  while (true) {
    oe => now;

    // grab the next message from the queue.
    while (oe.nextMsg()) {
      if (LOGGING) {
	<<<"Receiving OSC message on address:", OSCAddress>>>;
	
      }
      float x;
      float y;
      float newGain;
      string msg;
      oe.getFloat() => x;
      oe.getFloat() => y;
      oe.getFloat() => newGain;
      oe.getString() => msg;
      if (LOGGING) {
	<<<"x", x>>>;
	<<<"y", y>>>;
	<<<"newGain", newGain>>>;
	<<<"newGain", msg>>>;
      }

      if (msg == "off") {
        break;
      }
      if (msg == "silence") {
	TurnItDown(ugenX);
	TurnItDown(ugenY);
        continue;
      }

      (x * range) + min => ugenX.freq;
      (y * range) + min => ugenY.freq;

      ugenY.gain() => float oldGain;
      if (newGain != oldGain) {
	TurnItUp(ugenX, newGain);
	TurnItUp(ugenY, newGain);
      }
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

  BuildOSCAddress(createInstrumentAddress, 2, 0, 2) => string OSCAddress;
  <<<"building osc address for control messages", OSCAddress>>>;
  receiver.event(OSCAddress) @=> OscEvent @ osce;


  while (true) {
    osce => now;

    while (osce.nextMsg()) {
      float min;
      float max;
      string instrumentName;
      string sendAddress;

      osce.getFloat() => min;
      osce.getFloat() => max;
      osce.getString() => instrumentName;
      osce.getString() => sendAddress;
      <<<"instrument name:", instrumentName>>>;
      <<<"sendAddress", sendAddress>>>;
      // TODO: abstract creation of instruments
      if (instrumentName == "SinOsc") {
        <<<"Sporking shred",  sendAddress, receiver>>>;
        spork ~ SinOsc_listen(receiver, sendAddress, min, max);
      }
    }
  }
}


// listen to create new instruments
// MakeReceiver(6449) @=> OscRecv @ r;
// r.listen();
CreateInstrumentListener("/control", 6449);

while (true) {1::second => now;}
