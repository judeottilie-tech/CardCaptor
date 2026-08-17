import 'package:dio/dio.dart';
import '../models/pet.dart';
import 'api_client.dart';

class PetService {
  final Dio _dio = ApiClient().dio;

  Future<Pet> get() async {
    final response = await _dio.get('/pet');
    return Pet.fromJson(response.data);
  }

  Future<Pet> feed() async {
    final response = await _dio.post('/pet/feed');
    return Pet.fromJson(response.data);
  }
}
