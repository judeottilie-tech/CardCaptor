import 'package:dio/dio.dart';
import '../models/card.dart';
import 'api_client.dart';

class CardService {
  final Dio _dio = ApiClient().dio;

  Future<CardPage> search({
    String? search,
    String? category,
    String? rarity,
    String? era,
    int page = 1,
    int pageSize = 60,
  }) async {
    final response = await _dio.get('/card', queryParameters: {
      if (search != null && search.isNotEmpty) 'search': search,
      if (category != null && category.isNotEmpty) 'category': category,
      if (rarity != null && rarity.isNotEmpty) 'rarity': rarity,
      if (era != null && era.isNotEmpty) 'era': era,
      'page': page,
      'pageSize': pageSize,
    });
    return CardPage.fromJson(response.data);
  }
}
