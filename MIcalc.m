% This program is used to calculate the mutual information (both top-down
% and bottom-up) of the sampled population data.  
clear
clc
% Finer-grained epsilon data used
epsarray = [0.2, 0.225, 0.250,0.275, 0.3];
epsvals = length(epsarray);
metapops = 10;
avgeps = zeros(epsvals, metapops*3);

for eps = 1:epsvals
    for mpop = 1:metapops
        filename = sprintf('TEdata\\MX_%d_%d.csv', eps-1, mpop-1);
        if exist(filename, 'file')
            D = readmatrix(filename);
            avgeps(eps, (mpop-1)*3+1) = mutinfo(D(:,2),D(:,3));
            avgeps(eps, (mpop-1)*3+2) = mutinfo(D(:,3),D(:,4));
            avgeps(eps, (mpop-1)*3+3) = mutinfo(D(:,2),D(:,4));
        end
    end
    fprintf('Finished eps %d\n',eps);
end
mu = mean(avgeps,2);
sd = std(avgeps, 0, 2);
cis = zeros(length(epsarray), 2);
%2.045 from a t-distribution table for 95% confidence and 30 samples
cis(:, 1) = mu - 2.045*(sd./sqrt(length(avgeps(1,:))));
cis(:, 2) = mu + 2.045*(sd./sqrt(length(avgeps(1,:))));

%% Plot the mean and CI
augx =[epsarray, fliplr(epsarray)];
augy =[cis(:,1)', flipud(cis(:,2))'];
hold on
plot(epsarray, mu, 'k', 'linewidth', 1);
fill(augx, augy, 1,'facecolor', [.68 .38 1], 'edgecolor', 'none', 'facealpha', 0.4);
xlabel('global coupling strength (\epsilon)');
ylabel('mutual information (MI)')

legend('Average MI', '95% CI', 'Location', 'SouthEast');
hold off

%%
% Code generated by JIDT
function result = mutinfo(v1, v2)
    % Add JIDT jar library to the path, and disable warnings that it's already there:
    warning('off','MATLAB:Java:DuplicateClass');
    javaaddpath('C:\Users\mattt\Documents\infodynamics-dist-1.4\infodynamics.jar');
    % Add utilities to the path
    addpath('C:\Users\mattt\Documents\infodynamics-dist-1.4\demos\octave');

    % 0. Load/prepare the data:
    % Column indices start from 1 in Matlab:
    source = octaveToJavaIntArray(v1);
    destination = octaveToJavaIntArray(v2);

    % 1. Construct the calculator:
    calc = javaObject('infodynamics.measures.discrete.MutualInformationCalculatorDiscrete', 101, 0);
    % 2. No other properties to set for discrete calculators.
    % 3. Initialise the calculator for (re-)use:
    calc.initialise();
    % 4. Supply the sample data:
    calc.addObservations(source, destination);
    % 5. Compute the estimate:
    result = calc.computeAverageLocalOfObservations();

    %fprintf('MI_Discrete(col_0 -> col_1) = %.4f bits\n', result);
end