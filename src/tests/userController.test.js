import { expect } from 'chai';
import sinon from 'sinon'
import { getUser, insertNewUser, loginUser } from '../controller/userController.js'
import db from '../db/connection.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator';
import userQueries from '../db/queries/userQueries.js';

describe('User Controller Tests', () => {
    describe('getUser', () => {
        it('should return user data for a valid user ID', async () => {
            const mockUserId = '123';
            const mockDbResult = {
                rows: [
                    { id: '123', email: 'test@example.com', fullname: 'John Doe' },
                ],
            };


            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult);

            const req = { userId: mockUserId };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await getUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                id: '123',
                email: 'test@example.com',
                fullName: 'John Doe',
            })).to.be.true;


            queryStub.restore();
        });
    });

    describe('loginUser', () => {
        it('should successfully login and give a jwt token credentials', async () => {
            const mockEmail = 'test@gmail.com'
            const mockPass = 'mockPassword'

            const mockUser = {
                id: '1',
                email: mockEmail,
                password: mockPass
            }

            const mockDbResult = {
                rows: [mockUser]
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)
            const compareStub = sinon.stub(bcrypt, 'compare').resolves(true)
            const jwtTokenStub = sinon.stub(jwt, 'sign').resolves('mockAccessToken')



            const req = {
                body: {
                    email: mockEmail,
                    password: mockPass
                }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }


            await loginUser(req, res);


            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ token: 'mockAccessToken' })).to.be.true;


            queryStub.restore();
            compareStub.restore();
            jwtTokenStub.restore();
        });

        it('should returns 404 for an unregistered email', async () => {
            const mockEmail = 'notyetregistered@gmail.com'
            const mockPass = 'password'


            const mockDbResult = {
                rows: []
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)
            const compareStub = sinon.stub(bcrypt, 'compare').resolves(true)
            const jwtTokenStub = sinon.stub(jwt, 'sign').resolves('mockTokenAccess')


            const req = {
                body: {
                    email: mockEmail,
                    password: mockPass
                }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await loginUser(req, res)

            expect(res.status.calledWith(404)).to.be.true
            expect(res.json.calledWith({
                error: 'email not registered'
            })).to.be.true

            queryStub.restore()
            compareStub.restore()
            jwtTokenStub.restore()
        })

        it('should return 400 for a incorrect password', async () => {
            const mockEmail = 'test@gmail.com'
            const mockPass = 'wrongPass'

            const mockUser = {
                id: '1',
                email: 'test@gmail.com',
                password: 'password'
            }

            const mockdDbResult = {
                rows: [mockUser]
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockdDbResult)
            const compareStub = sinon.stub(bcrypt, 'compare').resolves(false)
            const jwtSignStub = sinon.stub(jwt, 'sign').resolves('mockAccessToken')

            const req = {
                body: {
                    email: mockEmail,
                    password: mockPass
                }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await loginUser(req, res)

            expect(res.status.calledWith(400)).to.be.true
            expect(res.json.calledWith({
                error: "wrong passwrod"
            }))

            queryStub.restore()
            compareStub.restore()
            jwtSignStub.restore()
        })
    });

    describe('InsertNewUser', () => {
        it('should returning 201 and registered email account', async () => {
            const mockEmail = 'new@gmail.com'
            const mockPassword = 'newPassword'
            const mockFullName = 'John Doe'

            const hashPassStub = sinon.stub(bcrypt, 'hash').resolves('hashedpassword')
            const validatorStub = sinon.stub(validator, 'isEmail').resolves(true)
            const queryStub = sinon.stub(db, 'query').resolves({ success: `${mockEmail} succesfully created, please login.` })

            const req = {
                body: {
                    email: mockEmail,
                    password: mockPassword,
                    fullname: mockFullName
                }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await insertNewUser(req, res)

            expect(validatorStub.calledWith(mockEmail)).to.be.true;
            expect(hashPassStub.calledWith(mockPassword)).to.be.true
            expect(queryStub.calledWith(
                userQueries.insertNewUser,
                [mockEmail, mockFullName, 'hashedpassword']
            )).to.be.true
            expect(res.status.calledWith(201)).to.be.true
            expect(res.json.calledWith({ success: `${mockEmail} succesfully created, please login.` })).to.be.true

            validatorStub.restore()
            hashPassStub.restore()
            queryStub.restore()
        });

        it('should return an error for invalid input data/type', async () => {
            const validatorStub = sinon.stub(validator, 'isEmail').returns(false)

            const req = {
                body: {
                    email: 'invalidEmail',
                    password: '',
                    fullname: ''
                }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await insertNewUser(req, res)
            // console.log(res.json.args)

            expect(validatorStub.calledWith('invalidEmail')).to.be.true
            expect(res.status.calledWith(422)).to.be.true
            expect(res.json.calledWith({ error: 'email is not valid, fullname is required, password is required' })).to.be.true;

            validatorStub.restore()
        })
    })
})