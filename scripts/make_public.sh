#!/bin/bash
declare -a output=($(aws s3api list-objects-v2 --bucket photography-shop --query='Contents[].Key' | jq -r '.[]'))
for value in "${output[@]}"
do
    aws s3api put-object-acl --bucket photography-shop --key $value --acl public-read
done