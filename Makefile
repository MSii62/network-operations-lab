audit:
	python automation/config_audit.py

health:
	python automation/network_health.py --targets 127.0.0.1,localhost

report:
	python automation/generate_report.py

test:
	python -m unittest discover -s tests -v

monitoring:
	docker compose up -d
