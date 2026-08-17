import 'package:dio/dio.dart';
import '../models/binder_page.dart';
import 'api_client.dart';

class BinderPageService {
  final Dio _dio = ApiClient().dio;

  Future<List<BinderPage>> getAll() async {
    final response = await _dio.get('/binderpage');
    return (response.data as List<dynamic>)
        .map((b) => BinderPage.fromJson(b))
        .toList();
  }

  Future<BinderPage> getById(int id) async {
    final response = await _dio.get('/binderpage/$id');
    return BinderPage.fromJson(response.data);
  }

  Future<BinderPage> create(String title, String? description) async {
    final response = await _dio.post('/binderpage', data: {
      'title': title,
      'description': description,
    });
    return BinderPage.fromJson(response.data);
  }

  Future<void> update(int id, String title, String? description) async {
    await _dio.put('/binderpage/$id', data: {
      'title': title,
      'description': description,
    });
  }

  Future<void> delete(int id) async {
    await _dio.delete('/binderpage/$id');
  }

  Future<void> setSlotCard(int slotId, int? cardId) async {
    if (cardId == null) {
      await _dio.delete('/binderpagecardslot/$slotId/card');
    } else {
      await _dio.put('/binderpagecardslot/$slotId/card', data: {
        'cardId': cardId,
      });
    }
  }
}
