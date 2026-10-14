import tempfile
import unittest
from pathlib import Path

from automation.config_audit import audit

class ConfigAuditTests(unittest.TestCase):
    def test_repository_configuration_passes_audit(self):
        root = Path(__file__).resolve().parents[1]
        findings = audit(root)
        self.assertTrue(findings)
        self.assertTrue(all(item.status == "PASS" for item in findings))

    def test_missing_control_is_reported(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            path = root / "configs/frr"
            path.mkdir(parents=True)
            (path / "r1.conf").write_text("hostname test\n", encoding="utf-8")
            (path / "r2.conf").write_text("router ospf\nip ospf\n", encoding="utf-8")
            (path / "edge-bgp.conf").write_text("router bgp\nneighbor\n", encoding="utf-8")
            firewall = root / "configs/firewall"
            firewall.mkdir(parents=True)
            (firewall / "policy.nft").write_text("policy drop\nmasquerade\n", encoding="utf-8")
            findings = audit(root)
            multicast = next(item for item in findings if item.control == "Multicast")
            self.assertEqual(multicast.status, "FAIL")

if __name__ == "__main__":
    unittest.main()
