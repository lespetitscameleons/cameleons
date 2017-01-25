#!/usr/bin/env python
# encoding: utf-8
"""
payment_checker.py

Created by Anne Pajon on 2014-12-01.
"""
from collections import defaultdict
import csv
import argparse
import os
import sys


def main():

    # get the options
    parser = argparse.ArgumentParser(description='Simple script to check if all pupils have paid.')
    parser.add_argument("--status", dest="status", action="store", help="csv file with 3 columns: [family,option,nb] of pupils who have paid (e.g. payment_status.txt)", required=True)
    parser.add_argument("--list", dest="list", action="store", help="csv file with 4 columns: [family,option,nb,status] of all pupils in class (e.g. pupil_list.txt)", required=True)
    parser.add_argument("--report", dest="report", action="store", help="Output file to store report (e.g. payment_report.txt)", required=True)
    options = parser.parse_args()

    if not os.path.exists(options.status):
        print 'File %s does not exist!' % options.status
        sys.exit()

    if not os.path.exists(options.list):
        print 'File %s does not exist!' % options.list
        sys.exit()

    payments = defaultdict(dict)
    with open(options.status, "U") as f:
        reader = csv.DictReader(f, delimiter=',')
        for line in reader:
            key = line['family'].replace(' ', '').lower()
            payments[key] = {'family': line['family'], 'status': line['status'], 'nb': line['nb'], 'option': line['option']}

    pupils = defaultdict(dict)
    with open(options.list, "U") as f:
        reader = csv.DictReader(f, delimiter=',')
        for line in reader:
            key = line['family'].replace(' ', '').lower()
            pupils[key] = {'family': line['family'], 'status': payments.get(key, 'NOT PAID'), 'nb': line['nb'], 'option': line['option']}

    with open(options.report, "w") as f:
        ordered_pupils = sorted(pupils.keys())
        f.write("family,nb,option,amount,status\n")
        for key in ordered_pupils:
            value = pupils[key]
            if value['status'] == 'NOT PAID':
                f.write("%s,%s,%s,N/A,NOT PAID\n" % (value['family'].title(), value['nb'], value['option']))
        for key in ordered_pupils:
            value = pupils[key]
            if not value['status'] == 'NOT PAID':
                if float(value['status']['status']) > 0:
                    f.write("%s,%s,%s,%s,NOT PAID\n" % (value['family'].title(), value['nb'], value['option'], value['status']['status']))
        for key in ordered_pupils:
            value = pupils[key]
            if not value['status'] == 'NOT PAID':
                if float(value['status']['status']) <= 0:
                    f.write("%s,%s,%s,%s,PAID\n" % (value['family'].title(), value['nb'], value['option'], value['status']['status']))
        for key in payments:
            value = payments[key]
            if key not in pupils.keys():
                f.write("%s,%s,%s,%s,UNKNOWN FAMILY\n" % (value['family'].title(), value['nb'], value['option'], value['status']))


if __name__ == '__main__':
    main()
