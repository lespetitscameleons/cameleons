#!/usr/bin/env python
# encoding: utf-8
"""
payment_checker.py

Created by Anne Pajon on 2017-01-23.
"""
from collections import defaultdict
import csv
import argparse
import os
import sys


def main():

    # get the options
    parser = argparse.ArgumentParser(description='Simple script to merge family members into one record.')
    parser.add_argument("--list", dest="list", action="store", help="Tab delimited file with 3 columns: [name, family, location] of all pupils in class (e.g. pupil_list.txt)", required=True)
    options = parser.parse_args()

    if not os.path.exists(options.list):
        print 'File %s does not exist!' % options.list
        sys.exit()

    pupils = []
    with open(options.list, "U") as f:
        reader = csv.DictReader(f, delimiter=',')
        for line in reader:
            pupils.append(line)

    merged_pupils = defaultdict(list)
    for pupil in pupils:
        merged_pupils[pupil['family']] += [pupil]

    merged_pupils_and_locations = {}
    for family in merged_pupils:
        merged_locations = defaultdict(list)
        for family_member in merged_pupils[family]:
            merged_locations[family_member['location']] += [family_member]

        merged_pupils_and_locations[family] = merged_locations

    print 'family,option,nb'
    for family in merged_pupils_and_locations:
        print '%s,%s,%s' % (family, '-'.join(merged_pupils_and_locations[family].keys()), len(merged_pupils_and_locations[family][merged_pupils_and_locations[family].keys()[0]]))

if __name__ == '__main__':
    main()
