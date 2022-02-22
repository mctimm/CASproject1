from contextlib import redirect_stdout
from distutils.log import log
from functools import reduce
import jpype
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
import math
import numpy as np
import jpype
import sys

def readFloatsFile(filename):
	"Read a 2D array of floats from a given file"
	with open(filename) as f:
		# Space separate numbers, one time step per line, each column is a variable
		array = []
		for line in f:
			# read all lines
			if (line.startswith("%") or line.startswith("#")):
				# Assume this is a comment line
				continue
			if (len(line.split()) == 0):
				# Line is empty
				continue
			array.append([float(x) for x in line.split()])
		return array

def entropy(pdf,axis=1):
    with np.errstate(all='ignore'):
        return -1.0*np.sum(np.nan_to_num(pdf*np.log2(pdf)),axis=axis)

#%% FUNCTION DEFINITIONS
def generatePDFs(X,numberOfBins,binRange=None):
    if not binRange:
       binRange=(X.min(),X.max())
    bins             = np.linspace(*binRange,numberOfBins)
    binAssignments   = np.digitize(X,bins)
    prob = np.ones(shape=(X.shape[0],numberOfBins))
    for inx,popBinAssignment in enumerate(binAssignments):
        for binNumber in range(1,numberOfBins):
           prob[inx,binNumber] = np.sum(popBinAssignment==binNumber)/X.shape[1] 
    return prob

def logmap(x,r):
    return r * x * (1-x)

R = 3.3
chaosR = 3.9

vals1 = list(range(0,100))
vals2 = list(range(0,100))

vals2[0] = 0.11
vals1[0] = 0.1
vals3 = list(range(0,100))
vals4 = list(range(0,100))

vals3[0] = 0.11
vals4[0] = 0.1

for i in range(1,100):
    vals2[i] = logmap(vals2[(i-1)],R)
    vals1[i] = logmap(vals1[(i-1)],R)
    vals3[i] = logmap(vals3[(i-1)],chaosR)
    vals4[i] = logmap(vals4[(i-1)],chaosR)
    
    
def logisticMapPlots(vals1, vals2, vals3, vals4):
    fig,ax=plt.subplots(2)
    ax[0].plot(range(0,100),vals2,label = "R = 3.3 | Initial = 0.1")
    ax[0].plot(range(0,100),vals1,label = "R = 3.3 | Initial = 0.11")
    ax[0].legend()
    ax[1].plot(range(0,100),vals4,label = "R = 3.85 | Initial = 0.1")
    ax[1].plot(range(0,100),vals3,label = "R = 3.85 | Initial = 0.11")
    fig.suptitle("Divergence and Chaos")
    ax[1].legend()
    #plt.show()

logisticMapPlots(vals1, vals2, vals3, vals4)
#The code below comes from https://github.com/judeter/CS523-TopDownCausation
#making the vendiagrams.
X = np.array([vals1,vals2,vals3,vals4])
X = X*100
print(X)
N = 15 # This by observation of looking at resulting plots
# bin discritization for use with JIDT tool
numberOfBins    = 10
binRange        = (0.0,100)
bins            = np.linspace(*binRange,numberOfBins)
binAssignments  = np.digitize(X,bins)

# Sanity check
# Calc pobability dist.
fullTimeSeries_pdfs  = generatePDFs(X,numberOfBins,binRange)
firstNtimesteps_pdfs = generatePDFs(X[:,:N],numberOfBins,binRange)
lastNtimesteps_pdfs  = generatePDFs(X[:,-N:],numberOfBins,binRange)
print("Shannon entropyies:")
print(entropy(fullTimeSeries_pdfs))
HofFirstN  = entropy(firstNtimesteps_pdfs)
HofLastN   = entropy(lastNtimesteps_pdfs)

np.savetxt('fullTimeSeries.txt',binAssignments.T,fmt='%d')    
np.savetxt('firstNtimesteps.txt',binAssignments[:,:N].T,fmt='%d')    
np.savetxt('lastNtimesteps.txt',binAssignments[:,-N:].T,fmt='%d')   

#%% Make Venn diagram
# Inputs       First N time steps          Last  N time steps
#             Non-Chaotic   Chaoti        Non-Chaotic  Chaotic          
Xentropies = [HofFirstN[0], HofFirstN[2], HofLastN[0], HofLastN[2]]  
Yentropies = [HofFirstN[1], HofFirstN[3], HofLastN[1], HofLastN[3]]  
mutualInfo = [1.5899,         1.8892,      0.9968,         1.0323] * 10
titles=['First {} Non-Chaotic','First {} Chaotic',
        'Last {} Non-Chaotic', 'Last {} Chaotic']
fig, axarr = plt.subplots(nrows=2, ncols=2, figsize=(8,8)) 

for ax,hx,hy,mi,ti in zip(np.ravel(axarr),Xentropies,Yentropies,mutualInfo,titles):
    
    venX = Circle((hx/2-mi/2,0),hx/2, 
                  alpha =0.1, color ='red', label='H(X)')
    venY = Circle((-hy/2+mi/2,0),hy/2, 
                  alpha =0.1, color ='blue', label='H(Y)')
    mutI = Circle((0,0),1,alpha =0.1, color='purple',label='I(X,Y)')
    ax.add_artist(venX);    ax.add_artist(venY);    #ax.text(0,0,'I(X;Y)')
    ax.set_title(ti.format(N))
    
    
    plt.legend(handles = [venX,venY,mutI])
    ax.set_xlim(-hy+mi/2,hx-mi/2)
    ax.set_ylim(max(hy,hx)/2,max(hy,hx)/-2)
    ax.axis('off')
    
    
plt.show()
