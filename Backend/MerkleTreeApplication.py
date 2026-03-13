import hashlib

def hash_add(left,right):
    result=left+right
    return hashlib.sha256(result.encode()).hexdigest()
def merkle_tree_create(hash_list):
    if len(hash_list)==0:
        return None
    if len(hash_list)==1:
        return hash_list[0]

    new_hash_list=[]

    for i in range(0,len(hash_list),2):
        left=hash_list[i]
        if i+1<len(hash_list):
            right=hash_list[i+1]
        else:
            right=left
        new_hash_list.append(hash_add(left,right))
    return merkle_tree_create(new_hash_list)
