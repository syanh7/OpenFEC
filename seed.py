import sys

'''this script populate db through bulk download files
from openfec.gov'''

data_list = []

#opens file
file = open(file_path)
#reads entire file and sets to text_string
for line in file:
    data_list.append(line.strip('\n').split('|'))


#--------committees master list------------


for ele in data_list:
    if ele[-1] == "NONE" or ele[-1] == ''
