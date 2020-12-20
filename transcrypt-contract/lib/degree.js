'use strict';

const { Contract } = require('fabric-contract-api');

class Degree extends Contract {
    
    async queryDegreeRecord(ctx, degreeId) {
        // get the degree data from chaincode state
        const degreeAsBytes = await ctx.stub.getState(degreeId); 
        if (!degreeAsBytes || degreeAsBytes.length === 0) {
            throw new Error(`${degreeId} does not exist`);
        }
        console.log(degreeAsBytes.toString());
        return degreeAsBytes.toString();
    }

    async createDegreeRecord(ctx, degreeId, studentName, program, specialization, 
                                enrollmentId, graduationDate, creditsEarned, university, issuer) {
        console.info('============= START : Create Degree Record ===========');

        const degree = {
            docType: 'degree',
            studentName,
            program,
            specialization,
            enrollmentId,
            graduationDate,
            creditsEarned,
            university,
            issuer
        };

        await ctx.stub.putState(degreeId, Buffer.from(JSON.stringify(degree)));
        console.info('============= END : Create Degree Record ===========');
    }

    async queryAllDegrees(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = Degree;
