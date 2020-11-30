'use strict';

const { Contract } = require('fabric-contract-api');

class Transcrypt extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const students = [
            {
                name: 'Manjot Singh',
                degree: 'B.Tech',
                branch: 'ME',
                rollno: '2017330',
                graduationYear: '2021',
                creditsEarned: '44',
            },
            {
                name: 'Ajwad Shaikh',
                degree: 'B.Tech',
                branch: 'ECE',
                rollno: '2017333',
                graduationYear: '2021',
                creditsEarned: '21',
            },
            {
                name: 'Kanishk Goyal',
                degree: 'B.Tech',
                branch: 'CSE',
                rollno: '2017322',
                graduationYear: '2021',
                creditsEarned: '38',
            },
            {
                name: 'Arnav Deep',
                degree: 'B.Tech',
                branch: 'ME',
                rollno: '2017316',
                graduationYear: '2021',
                creditsEarned: '6',
            },
            {
                name: 'Nikhil Gupta',
                degree: 'B.Tech',
                branch: 'CSE',
                rollno: '2017335',
                graduationYear: '2021',
                creditsEarned: '49',
            },
            {
                name: 'Shailesh Bankar',
                degree: 'B.Tech',
                branch: 'ECE',
                rollno: '2017346',
                graduationYear: '2021',
                creditsEarned: '0.5',
            },
        ];

        for (let i = 0; i < students.length; i++) {
            students[i].docType = 'student';
            await ctx.stub.putState('STUDENT' + i, Buffer.from(JSON.stringify(students[i])));
            console.info('Added <--> ', students[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryStudentRecord(ctx, studentNumber) {
        const studentAsBytes = await ctx.stub.getState(studentNumber); // get the student data from chaincode state
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${studentNumber} does not exist`);
        }
        console.log(studentAsBytes.toString());
        return studentAsBytes.toString();
    }

    async createStudentRecord(ctx, studentNumber, name, degree, branch, rollno, graduationYear, creditsEarned) {
        console.info('============= START : Create Student Record ===========');

        const student = {
            name,
            docType: 'student',
            degree,
            branch,
            rollno,
            graduationYear,
            creditsEarned,
        };

        await ctx.stub.putState(studentNumber, Buffer.from(JSON.stringify(student)));
        console.info('============= END : Create Student Record ===========');
    }

    async queryAllStudents(ctx) {
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

module.exports = Transcrypt;
