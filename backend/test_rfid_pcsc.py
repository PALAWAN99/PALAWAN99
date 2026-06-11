import sys
from smartcard.System import readers as pcsc_readers_fn
from smartcard.util import toHexString

def test_rfid_pcsc():
    print("Listing PC/SC readers...")
    try:
        available = pcsc_readers_fn()
    except Exception as e:
        print(f"Error listing readers: {e}")
        return

    if not available:
        print("No PC/SC readers found.")
        return

    print(f"Found {len(available)} reader(s):")
    for i, r in enumerate(available):
        print(f"  [{i}] {r}")

    for i, r in enumerate(available):
        print(f"\n--- Testing Reader [{i}]: {r} ---")
        try:
            connection = r.createConnection()
            print("Attempting to connect...")
            connection.connect()
            print("Connected successfully!")
            
            # Try FF CA 00 00 00 (Get UID)
            cmd = [0xFF, 0xCA, 0x00, 0x00, 0x00]
            print(f"Sending GET UID APDU: {toHexString(cmd)}")
            try:
                data, sw1, sw2 = connection.transmit(cmd)
                print(f"Response data: {toHexString(data)}")
                print(f"Status bytes : {sw1:02X} {sw2:02X}")
            except Exception as e:
                print(f"Transmit failed: {e}")
                
            connection.disconnect()
            print("Disconnected.")
        except Exception as e:
            print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_rfid_pcsc()
