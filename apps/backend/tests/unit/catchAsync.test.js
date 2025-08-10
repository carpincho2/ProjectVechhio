const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/errors/AppError');

describe('catchAsync', () => {
  it('should catch errors from async functions and pass them to next', async () => {
    const errorMessage = 'Test error';
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn(); // Mock the next function

    const asyncFunction = async (req, res, next) => {
      throw new Error(errorMessage);
    };

    const wrappedFunction = catchAsync(asyncFunction);

    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: errorMessage }));
  });

  it('should execute the async function successfully', async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(), // Mock status to return 'this' for chaining
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    const asyncFunction = async (req, res, next) => {
      res.status(200).json({ message: 'Success' });
    };

    const wrappedFunction = catchAsync(asyncFunction);

    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled(); // next should not be called on success
  });
});