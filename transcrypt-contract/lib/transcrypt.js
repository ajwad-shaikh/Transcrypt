'use strict';

const { Contract } = require('fabric-contract-api');

class Transcrypt extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const degrees = [
            {
                studentName: 'Manjot Singh',
                program: 'Bachelor of Technology',
                specialization: 'Electronics and Communication Engineering',
                enrollmentId: '2017330',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
            {
                studentName: 'Ajwad Shaikh',
                program: 'Bachelor of Technology',
                specialization: 'Computer Science and Engineering',
                enrollmentId: '2017333',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
            {
                studentName: 'Kanishk Goyal',
                program: 'Bachelor of Technology',
                specialization: 'Mechanical Engineering',
                enrollmentId: '2017322',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
            {
                studentName: 'Shailesh Bankar',
                program: 'Bachelor of Technology',
                specialization: 'Mechanical Engineering',
                enrollmentId: '2017346',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
            {
                studentName: 'Kaushal Sharma',
                program: 'Bachelor of Technology',
                specialization: 'Computer Science and Engineering',
                enrollmentId: '2017324',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
            {
                studentName: 'Abhay Kesharwani',
                program: 'Bachelor of Technology',
                specialization: 'Electronics and Communication Engineering',
                enrollmentId: '2017304',
                graduationDate: '27-05-2021',
                creditsEarned: '150',
                university: 'IIITDM Jabalpur',
                issuer: 'Registrar IIITDMJ (registrar@iiitdmj.ac.in)',
            },
        ];

        for (let i = 0; i < degrees.length; i++) {
            degrees[i].docType = 'degree';
            await ctx.stub.putState('DEGREE' + i, Buffer.from(JSON.stringify(degrees[i])));
            console.info('Added <--> ', degrees[i]);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

}

module.exports = Transcrypt;
