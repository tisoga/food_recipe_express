import sinon from 'sinon'
import db from '../db/connection.js'
import { editFoodData, getAllFoodData, getFoodDataByID, newFoodData } from '../controller/foodController.js'
import { expect } from 'chai'
import validator from 'validator'
import foodQueries from '../db/queries/foodQueries.js'


describe('Food Controllers Test', () => {
    describe('getAllFoodData', () => {
        it('should return all food data', async () => {
            const mockFoodData = {
                id: '1',
                name: 'foodSample',
                image: 'www.imageoffood.com',
                category: ['food'],
                created_by: 'admin'
            }

            const mockDbResult = {
                rows: [mockFoodData]
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const req = { body: {} }
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await getAllFoodData(req, res)

            expect(res.status.calledWith(200)).to.be.true
            expect(res.json.calledWith([mockFoodData])).to.be.true

            queryStub.restore()
        });
    })

    describe('getFoodDataById', () => {
        it('should return food data for a valid food ID', async () => {
            const mockFoodId = '1'
            const mockFoodData = {
                id: '1',
                name: 'foodSample',
                image: 'www.imageoffood.com',
                category: ['food'],
                created_by: 'admin'
            }

            const mockDbResult = {
                rows: [mockFoodData]
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const mockReq = { params: { id: mockFoodId } }
            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await getFoodDataByID(mockReq, mockRes)

            expect(mockRes.status.calledWith(200)).to.be.true
            expect(mockRes.json.calledWith(mockFoodData)).to.be.true

            queryStub.restore()
        });

        it('should return an error if the food ID does not exist', async () => {
            const mockFoodId = '11'

            const mockDbResult = {
                rows: []
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const mockReq = { params: { id: mockFoodId } }
            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await getFoodDataByID(mockReq, mockRes)

            expect(mockRes.status.calledWith(404)).to.be.true
            expect(mockRes.json.calledWith({ error: 'Food ID did not exist' })).to.be.true

            queryStub.restore()
        });
    })

    describe('insertNewFood', () => {
        it('should return status 201 and new food data for valid input', async () => {
            const mockIdUser = '1'
            const mockName = 'newFood'
            const mockImage = 'www.imageofnewfood.com'
            const mockCategory = ['seafood']
            const mockRecipe = ['stepsBySteps']

            const mockDbResult = {
                name: mockName,
                image: mockImage,
                category: mockCategory,
                recipe: mockRecipe
            }

            const validatorStub = sinon.stub(validator, 'isURL').resolves(true)
            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const mockReq = {
                userId: mockIdUser,
                body: {
                    name: mockName,
                    image: mockImage,
                    category: mockCategory,
                    recipe: mockRecipe
                }
            }

            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await newFoodData(mockReq, mockRes)

            expect(queryStub.calledWith(
                foodQueries.insertFoodData,
                [mockName, mockImage, mockCategory, mockRecipe, mockIdUser]
            )).to.be.true
            expect(mockRes.status.calledWith(201)).to.be.true
            expect(mockRes.json.calledWith({
                name: mockName,
                image: mockImage,
                category: mockCategory,
                recipe: mockRecipe
            })).to.be.true

            validatorStub.restore()
            queryStub.restore()
        });

        it('should return an error for invalid input, including an invalid image URL', async () => {
            const validatorStub = sinon.stub(validator, 'isURL').returns(false)

            const mockReq = {
                body: {
                    name: '',
                    image: 'notaValidUrl',
                    category: '',
                    recipe: ''
                }
            }

            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await newFoodData(mockReq, mockRes)

            expect(validatorStub.calledWith(mockReq.body.image)).to.be.true
            expect(mockRes.status.calledWith(422)).to.be.true
            expect(mockRes.json.calledWith({
                error: 'name required, image should be valid URL, category type should be array, recipe type should be array'
            }))

            validatorStub.restore()
        });
    });

    describe('editFoodData', () => {
        it('should return edited food data for a valid food ID', async () => {
            const mockFoodId = '1'
            const mockName = 'editedFood'
            const mockImage = 'www.imageofEditedfood.com'
            const mockCategory = ['seafood', 'chinnese']
            const mockRecipe = ['stepsBySteps', 'newStep']

            const mockDbResult = {
                rows: [
                    {
                        id: mockFoodId,
                        name: mockName,
                        image: mockImage,
                        category: mockCategory,
                        recipe: mockRecipe
                    }
                ]
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const mockReq = {
                params: { id: 1 },
                body: {
                    name: mockName,
                    image: mockImage,
                    category: mockCategory,
                    recipe: mockRecipe
                }
            }

            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await editFoodData(mockReq, mockRes)

            expect(mockRes.status.calledWith(200)).to.be.true

            queryStub.restore()
        });

        it('should return error if food id does not exist', async () => {
            const mockFoodId = '1'

            const mockDbResult = {
                rows: []
            }

            const queryStub = sinon.stub(db, 'query').resolves(mockDbResult)

            const mockReq = {
                params: {
                    id: mockFoodId
                },
                body: {
                    name: '',
                    image: '',
                    category: '',
                    recipe: ''
                }
            }

            const mockRes = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            await editFoodData(mockReq, mockRes)

            expect(mockRes.status.calledWith(404)).to.be.true
            expect(mockRes.json.calledWith({
                error: 'Food ID did not exist'
            })).to.be.true

            queryStub.restore()
        });
    })
})