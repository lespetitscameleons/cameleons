# Payments

To run the script `payment_checker.py`, follow these steps:

- Get the list of all pupils and run `merge_family.py` script
```
python payments/merge_family.py --list pupils.csv > merged-pupils.csv
```
`pupils.csv` is a comma separated file with three columns `name,family,location`. The merged file is a comma separated file with three columns `family,option,nb` where pupils from the same family have been merged as well as for pupils attending multiple sessions across the week (column `location` merged into `option`).

- Get the list of all payments per family and run `payment_checker.py` script
```
python payments/payment_checker.py --list merged-pupils.csv --status payments.csv --report report.csv
```
`payments.csv` is a comma separared file with four columns `family,option,nb,status` where `status` gives you the amount of money left to be paid (Negative values mean over payments). The `report.csv` file contains `family,nb,option,amount,status` which reports `NOT PAID`, `PAID` or `UNKNOWN FAMILY`.
