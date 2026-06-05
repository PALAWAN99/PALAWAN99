import unittest
from unittest.mock import patch

from card_reader import _retry_vendor_read


class RetryVendorReadTests(unittest.TestCase):
    def test_retries_transient_usb_failure_once(self):
        attempts = {"count": 0}

        def flaky_read():
            attempts["count"] += 1
            if attempts["count"] == 1:
                raise Exception("DUALi DE-620 not found on USB")
            return "ok"

        with patch("card_reader.close_vendor_reader") as close_reader:
            with patch("time.sleep", return_value=None):
                result = _retry_vendor_read(flaky_read, attempts=2)

        self.assertEqual(result, "ok")
        self.assertEqual(attempts["count"], 2)
        close_reader.assert_called_once()

    def test_does_not_retry_non_transient_error(self):
        attempts = {"count": 0}

        def broken_read():
            attempts["count"] += 1
            raise Exception("Reader error: EMPTY (NO IC CARD)")

        with patch("card_reader.close_vendor_reader") as close_reader:
            with patch("time.sleep", return_value=None):
                with self.assertRaisesRegex(Exception, "NO IC CARD"):
                    _retry_vendor_read(broken_read, attempts=2)

        self.assertEqual(attempts["count"], 1)
        close_reader.assert_not_called()


if __name__ == "__main__":
    unittest.main()
