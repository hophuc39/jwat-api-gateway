import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { type ClientGrpc } from '@nestjs/microservices';
import { InverterModel } from './dto/inverter.model';
import { firstValueFrom } from 'rxjs';
import { GqlAuthGuard } from '../auth/guard/gql-auth.guard';
import { InverterList } from './dto/list-inverter.model';
import { FindAllInvertersInput } from './dto/find-all-inverters.input';
import { CreateInverterInput } from './dto/create-inverter.input';
import { UpdateInverterInput } from './dto/update-inverter.input';
import { GraphQLError } from 'graphql';
import { InverterServiceClient } from 'jwat-protobuf/inverter';
import { Permissions } from '../auth/guard/permission.decorator';
import { PermissionGuard } from '../auth/guard/permission.guard';

export class InverterResolver implements OnModuleInit {
  private inverterService: InverterServiceClient;

  constructor(
    @Inject('INVERTER_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.inverterService =
      this.client.getService<InverterServiceClient>('InverterService');
  }

  @UseGuards(GqlAuthGuard, PermissionGuard)
  @Permissions('create.inverter')
  @Mutation(() => InverterModel)
  async createInverter(
    @Args('input', { type: () => CreateInverterInput })
    input: CreateInverterInput,
  ) {
    const {
      inverterCode,
      inverterName,
      slaveAddress,
      startAddress,
      useFlag,
      numberOfPoles,
    } = input;

    const data = await firstValueFrom(
      this.inverterService.createInverter({
        inverterCode,
        inverterName,
        slaveAddress,
        startAddress,
        useFlag,
        numberOfPoles,
      }),
    );

    const { item: inverter } = data;

    if (!inverter) {
      throw new InternalServerErrorException('Failed to create inverter');
    }

    return { inverter };
  }

  @UseGuards(GqlAuthGuard, PermissionGuard)
  @Permissions('update.inverter')
  @Mutation(() => InverterModel)
  async updateInverter(
    @Args('input', { type: () => UpdateInverterInput })
    input: UpdateInverterInput,
  ) {
    const {
      id,
      inverterName,
      slaveAddress,
      startAddress,
      numberOfPoles,
      useFlag,
    } = input;

    const data = await firstValueFrom(
      this.inverterService.updateInverter({
        id,
        inverterName,
        slaveAddress,
        startAddress,
        numberOfPoles,
        useFlag,
      }),
    );

    const { item: inverter } = data;

    if (!inverter) {
      throw new GraphQLError('Failed to update inverter', {
        extensions: {
          status: 500,
        },
      });
    }

    return inverter;
  }

  @UseGuards(GqlAuthGuard, PermissionGuard)
  @Permissions('list.inverter')
  @Query(() => InverterList)
  async findAllInverters(
    @Args('filter', { type: () => FindAllInvertersInput })
    filter: FindAllInvertersInput,
  ) {
    const { page, pageSize, inverterCode, inverterName, useFlag } = filter;

    const data = await firstValueFrom(
      this.inverterService.findAllInverters({
        page,
        pageSize,
        inverterCode,
        inverterName,
        useFlag,
      }),
    );

    const { items, pagination } = data;

    return {
      items: items ?? [],
      pagination: pagination ?? {
        total: 0,
        page: page ?? 1,
        pageSize: pageSize ?? 10,
      },
    };
  }

  @Query(() => InverterModel, { nullable: true })
  async findInverterById(@Args('id') id: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      throw new BadRequestException('ID must be a valid UUID');
    }
    try {
      const data = await firstValueFrom(
        this.inverterService.findInverterById({ id }),
      );

      const { item: inverter } = data;

      if (!inverter) {
        throw new NotFoundException(`Inverter with ID ${id} not found`);
      }

      return inverter;
    } catch (error) {
      if (error.code === 5) {
        throw new NotFoundException(`Inverter with ID ${id} not found`);
      }

      throw error;
    }
  }
}
