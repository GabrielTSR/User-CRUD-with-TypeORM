import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        const users = await this.userRepository.find();

        if (users) return users;

        response.status(404).send('Users not found');
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const user = await this.userRepository.findOne({ where: { id: request.params.id } });

        if (user) return user;

        response.status(404).send('User not found');
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            const userCreated = await this.userRepository.save(request.body);
            return userCreated;
        } catch (error) {
            response.status(400).send("Can't save user");
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let userToUpdate = await this.userRepository.findOneBy({ id: request.params.id });
        const { firstName, lastName, age } = request.body;

        //Checking if any of the fields arrived
        if (firstName || lastName || age) {
            if (userToUpdate) {
                if (firstName) userToUpdate.firstName = firstName;
                if (lastName) userToUpdate.lastName = lastName;
                if (age) userToUpdate.age = age;

                return await this.userRepository.save(userToUpdate);
            } else response.status(404).send('User not found');
        } else response.status(400).send('No fields to update');
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOneBy({ id: request.params.id });

        if (userToRemove) return await this.userRepository.remove(userToRemove);

        return response.status(404).send('User not found');
    }
}
