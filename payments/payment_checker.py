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
    parser.add_argument("--status", dest="status", action="store", help="Tab delimited file with 2 columns: [name, family] of pupils who have paid (e.g. payment_status.txt)", required=True)
    parser.add_argument("--list", dest="list", action="store", help="Tab delimited file with 2 columns: [name, family] of all pupils in class (e.g. pupil_list.txt)", required=True)
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
        reader = csv.DictReader(f, delimiter='\t')
        for line in reader:
            key = line['family'].replace(' ', '').lower() + '_' + line['name'].replace(' ', '').lower()
            payments[key] = {'name': line['name'], 'family': line['family'], 'status': line['status']}

    pupils = defaultdict(dict)
    with open(options.list, "U") as f:
        reader = csv.DictReader(f, delimiter='\t')
        for line in reader:
            key = line['family'].replace(' ', '').lower() + '_' + line['name'].replace(' ', '').lower()
            pupils[key] = {'name': line['name'], 'family': line['family'], 'status': payments.get(key, 'NOT PAID'), 'email1': line['email1'], 'email2': line['email2']}

    with open(options.report, "w") as f:
        f.write('--------------------------------------------------------------------------------\n')
        f.write('-- Pupils in class without payment status information\n')
        f.write('--------------------------------------------------------------------------------\n')
        ordered_pupils = sorted(pupils.keys())
        for key in ordered_pupils:
            value = pupils[key]
            if value['status'] == 'NOT PAID':
                f.write("%s\t%s\t%s\t%s\t%s\n" % (value['family'].title(), value['name'].title(), value['email1'], value['email2'], value['status']))
        f.write('\n')
        f.write('--------------------------------------------------------------------------------\n')
        f.write('-- Pupils in class with payment status information\n')
        f.write('--------------------------------------------------------------------------------\n')
        for key in ordered_pupils:
            value = pupils[key]
            if not value['status'] == 'NOT PAID':
                f.write("%s\t%s\t%s\t%s\t%s\n" % (value['family'].title(), value['name'].title(), value['email1'], value['email2'], value['status']['status']))
        f.write('\n')
        f.write('--------------------------------------------------------------------------------\n')
        f.write('-- Pupils not in class \n')
        f.write('--------------------------------------------------------------------------------\n')
        for key in payments:
            value = payments[key]
            if key not in pupils.keys():
                f.write("%s\t%s\t%s\t%s\n" % (value['family'].title(), value['name'].title(), 'NOT IN CLASS', value['status']))


if __name__ == '__main__':
    main()

